package com.eturia.api.services;

import com.amazonaws.services.lambda.runtime.Context;
import com.eturia.jolt.transform.EntitiesJoltTransformHandler;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

class EntitiesJoltTransformHandlerTest {

  private final ObjectMapper objectMapper = new ObjectMapper();
  private final EntitiesJoltTransformHandler entitiesJoltTransformHandler = new EntitiesJoltTransformHandler();

  @Test
  public void updateHotelEvent() throws IOException {
    entitiesJoltTransformHandler.handleRequest(getMockedInput("hotelRecord.json"), Mockito.mock(Context.class));
  }

  @Test
  public void updateAccountEventWithFakeEntity() throws IOException {
    entitiesJoltTransformHandler.handleRequest(getMockedInput("accountRecord_1.json"), Mockito.mock(Context.class));
  }

  @SuppressWarnings("unchecked")
  private Map<String, Object> getMockedInput(String input) throws IOException {
    return objectMapper.readValue(getClass().getClassLoader().getResourceAsStream(input), Map.class);
  }

}
