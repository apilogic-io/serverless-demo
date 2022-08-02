package com.eturia.clients.common;


import com.eturia.clients.common.parsers.XmlPath;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.*;

public class FunctionUtils {

  public static String getRequestXml(String entity) throws IOException {
    return readLineByLineJava8(FunctionUtils.class.getClassLoader().getResource("soap/input/" + entity + ".xml"));
  }

  public static String getRequestXml(URL url) throws IOException {
    return readLineByLineJava8(url);
  }

  private static String readLineByLineJava8(URL filePath) throws IOException {
    if (filePath == null) {
      throw new RuntimeException();
    }

    try (BufferedReader in = new BufferedReader(new InputStreamReader(filePath.openStream()))) {
      StringBuilder contentBuilder = new StringBuilder();
      String inputLine;
      while ((inputLine = in.readLine()) != null) {
        contentBuilder.append(inputLine).append("\n");
      }
      return contentBuilder.toString();
    }
  }

  @SuppressWarnings("rawtypes")
  public static Optional<?> getNestedObjectFromMap(Object input, String path) {
    String[] paths = path.split("\\.");
    Object output = input;
    for (String subPath : paths) {
      if (output != null) {
        output = ((Map) output).get(subPath);
      } else {
        break;
      }
    }
    if (output == null) {
      return Optional.empty();
    }
    if (output instanceof Map) {
      if (((Map<?, ?>) output).isEmpty()) {
        return Optional.empty();
      }
    }
    return Optional.of(output);
  }

  public static void represent(XmlPath rootXmlPath,
                               List<String> arrayRepresentation,
                               Map input) {
    boolean isArray = arrayRepresentation.stream().anyMatch(s -> s.equals(rootXmlPath.getPath()));
    input.putAll(rootXmlPath.getValues());
    if (isArray) {
      List arr = new ArrayList();
      input.put(rootXmlPath.getCurrentPath(), arr);
      rootXmlPath.getChildren().forEach(ch -> {
        Map el = new HashMap();
        represent(ch, arrayRepresentation, el);
        arr.add(el);
      });
    } else {
      rootXmlPath.getChildren().forEach(ch -> {
        Map el = new HashMap();
        represent(ch, arrayRepresentation, el);
        if (el.get(ch.getCurrentPath()) != null) {
          input.putAll(el);
        } else {
          Map res = new HashMap();
          res.put(ch.getCurrentPath(), el);
          input.putAll(res);
        }
      });
    }
  }
}
