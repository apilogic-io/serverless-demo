package com.eturia.clients.common;

import com.eturia.clients.common.entities.ParsecCredentials;
import com.eturia.clients.common.entities.ParsecUserCredentials;
import com.google.gson.Gson;
import com.amazonaws.services.lambda.runtime.Context;
import com.eturia.clients.common.entities.EventFunction;
import com.eturia.clients.common.jolt.JoltService;
import com.eturia.clients.common.parsers.XmlParser;
import com.eturia.clients.common.parsers.XmlParserConfig;
import com.eturia.clients.common.parsers.YamlPathConfig;
import com.google.gson.JsonElement;
import org.yaml.snakeyaml.Yaml;

import java.io.InputStream;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;
import java.util.stream.Collectors;

public class CommonService {
  private static final Gson GSON = new Gson();

  public static Map<String, Object> xmlParser(Map<String, Object> input,
                                              Context context,
                                              String entity) throws Exception {
    System.out.println("Parsec response before xml parsing:");
    System.out.println(GSON.toJson(input));
    System.out.println("Starting xml parser");
    long startTime = System.currentTimeMillis();
    Optional<?> value = FunctionUtils.getNestedObjectFromMap(input, "prev.result.body");
    if (value.isPresent()) {
      Map<String, Object> xmlParserConfigMap = getXmlParserConfig(entity);
      XmlParserConfig xmlParserConfig = new XmlParserConfig(xmlParserConfigMap.get("contextPath").toString(),
        (List<String>) xmlParserConfigMap.get("arrayPaths"));
      Object move = xmlParserConfigMap.get("move");
      if(move != null) {
        xmlParserConfig.setMove((List<Map<String, Integer>>) move);
      }
      Map<String, Object> result = XmlParser.parse(value.get().toString(), xmlParserConfig);
      long endTime = System.currentTimeMillis();
      long duration = (endTime - startTime);
      String message = "Transformation duration " + duration;
      System.out.println(message);
      System.out.println(GSON.toJson(result));
      return result;
    }
    throw new RuntimeException();
  }

  @SuppressWarnings({"rawtypes", "unchecked"})
  public static Object joltParser(Map<String, Object> input,
                                  Context context,
                                  String entity
                                  ) throws Exception {
    System.out.println("Starting jolt transformations");
    long startTime = System.currentTimeMillis();
    Optional value = FunctionUtils.getNestedObjectFromMap(input, "prev.result");
    Object result = null;
    Optional errors = FunctionUtils.getNestedObjectFromMap(input, "prev.result.Errors");
    if (errors.isPresent()) {
      Map joltErrors = (Map) JoltService.transform("error", errors.get());
      Map tmpResult = (Map) JoltService.transform(entity, value.orElse(new HashMap<>()));
      joltErrors.putAll(tmpResult);
      return joltErrors;
    } else if (value.isPresent()) {
      result = JoltService.transform(entity, value.get());
    }
    else {
        value = FunctionUtils.getNestedObjectFromMap(input, "arguments." + entity);
        if(value.isPresent()) {
          result = JoltService.transform(entity, value.get());
        }
    }
    if(result == null) {
      throw new RuntimeException();
    }
    System.out.println("Jolt transformations success");
    long endTime = System.currentTimeMillis();
    long duration = (endTime - startTime);
    String message = "Jolt transformation duration " + duration;
    System.out.println(message);
    System.out.println(GSON.toJson(result));
    return result;
  }

  public static Object joltParser(Map<String, Object> input, String entity) throws Exception {
      return JoltService.transform(entity, input);
  }

  public static List<YamlPathConfig> getYamlPathsConfig(String entities) {
    InputStream inputStream = CommonService.class.getClassLoader().getResourceAsStream(entities + ".yaml");
    List<Map<?,?>> configs = new Yaml().load(inputStream);
    return configs.stream()
      .map(cfg -> new YamlPathConfig(cfg.get("path").toString(), cfg.get("array")))
      .collect(Collectors.toList());
  }

  public static EventFunction getEventFunctionMappings(String path, String ymlFile) {
    InputStream inputStream = CommonService.class.getClassLoader().getResourceAsStream(String.join("/",path, ymlFile));
    return new Yaml().loadAs(inputStream, EventFunction.class);
  }

  @SuppressWarnings("rawtypes")
  public static ParsecCredentials getParsecCredentials(String user) {
    InputStream inputStream = CommonService.class.getClassLoader().getResourceAsStream("credentials.yml");
    Map credentialsMap = new Yaml().loadAs(inputStream, Map.class);
    Gson gson = new Gson();
    JsonElement jsonElement = gson.toJsonTree(credentialsMap);
    ParsecUserCredentials credentials = gson.fromJson(jsonElement, ParsecUserCredentials.class);
    return credentials.getUsernames().get(user);
  }

  public static Map<String, Object> getXmlParserConfig(String entities) {
    InputStream inputStream = CommonService.class.getClassLoader().getResourceAsStream(entities + ".yaml");
    Yaml yaml = new Yaml();
    return yaml.load(inputStream);
  }

  private static Optional<String> getEntities(Context context, Map<String, Object> input) {
    if (context != null) {
      System.out.println("entering the function");
    }
    Optional<?> entity = FunctionUtils.getNestedObjectFromMap(input, "args.entity");
    return entity.map(o -> o.toString().toLowerCase());
  }


}
