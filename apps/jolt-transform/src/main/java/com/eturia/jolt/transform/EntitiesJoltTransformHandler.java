package com.eturia.jolt.transform;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.eturia.clients.common.CommonService;
import com.eturia.clients.common.entities.EventFunction;
import com.eturia.clients.common.entities.EventFunctionMapping;

import java.util.Collections;
import java.util.List;
import java.util.Map;

public class EntitiesJoltTransformHandler implements RequestHandler<Map<String, Object>, Object> {

  @Override
  @SuppressWarnings({"unchecked", "rawtypes"})
  public Object handleRequest(Map<String, Object> input, Context context) {
    String entity = getEntity(input);
    System.out.println("Fetched entity from ARN: " + entity);
    if (entity != null) {
      String jolt = getIndexAndJolt(entity);
      try {
        Map<String, Object> object = (Map<String, Object>) CommonService.joltParser(input, jolt);
        Object data = object.get("data");
        if(data == null || ((Map)data).isEmpty()) {
          System.out.println("Fake Entity will not be handled");
          return Collections.emptyMap();
        }
        Object ids = object.get("id");
        List<String> idList;
        String actualId;
        if (ids instanceof List) {
          idList = (List<String>) ids;
          actualId = idList.stream().filter(id -> {
            Map<String, Object> dataMap = (Map<String, Object>) data;
            return dataMap.entrySet().stream().noneMatch(entry -> entry.getValue() != null && entry.getValue().toString().equals(id));
          }).findFirst().orElse(null);
          if (actualId == null && !idList.isEmpty()) {
            actualId = idList.get(0);
          }
          if (actualId == null) {
            System.out.println("Fake Entity will not be handled");
            return Collections.emptyMap();
          }
        } else {
          actualId = (String) ids;
        }
        object.put("id", actualId);
        Map<String, Object> dataMap = (Map<String, Object>) data;
        dataMap.put("id", actualId);
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
    System.out.println("Record: " + input.toString());
    return input.get("eventSourceARN").toString();
  }

  private String getIndexAndJolt(String entity) {
    EventFunction eventFunction = CommonService.getEventFunctionMappings("events", "dynamoEventsMapping.yml");
    return eventFunction.getEvents().stream()
      .filter(ef -> entity.contains(ef.getTableName()))
      .findFirst().map(EventFunctionMapping::getJoltName).orElse(null);
  }

}
