package com.eturia.jolt.transform;

import com.amazonaws.services.lambda.runtime.Context;
import com.eturia.clients.common.CommonService;
import com.eturia.clients.common.entities.EventFunction;
import com.eturia.clients.common.entities.EventFunctionMapping;
import org.json.simple.JSONObject;

import java.util.Collections;
import java.util.Map;

public class ElasticDataMappingJoltTransformHandler {

  public Object transform(Map<String, Object> input, Context context) {
    String entity = getEntity(input);
    JSONObject dataInput = new JSONObject((Map) input.get("prev"));
    System.out.println("Fetched entity from ARN: " + entity);
    if (entity != null) {
      String jolt = getIndexAndJolt(entity);
      try {
        Map<String, Object> object = (Map<String, Object>) CommonService.joltParser(dataInput, jolt);
        Object data = object.get("data");
        if(data == null || ((Map)data).isEmpty()) {
          System.out.println("Fake Entity will not be handled");
          return Collections.emptyMap();
        }
        System.out.println("Transformation result:" + object);
        return object;
      } catch (Exception e) {
        System.out.println("Failed to get configuration for " + context.getFunctionName());
        throw new RuntimeException();
      }
    } else {
      System.out.println("Failed to get configuration for " + context.getFunctionName());
      throw new RuntimeException();
    }
  }

  private String getEntity(Map<String, Object> input) {
    return new JSONObject((Map) input.get("stash")).get("indexName").toString();
  }

  private String getIndexAndJolt(String entity) {
    EventFunction eventFunction = CommonService.getEventFunctionMappings("events", "elasticListMappings.yml");
    return eventFunction.getEvents().stream()
            .filter(ef -> entity.contains(ef.getTableName()))
            .findFirst().map(EventFunctionMapping::getJoltName).orElse(null);
  }

}
