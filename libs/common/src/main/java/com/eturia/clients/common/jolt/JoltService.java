package com.eturia.clients.common.jolt;

import com.bazaarvoice.jolt.Chainr;
import com.bazaarvoice.jolt.chainr.ChainrBuilder;
import com.eturia.clients.common.FunctionUtils;
import com.google.gson.Gson;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;


public class JoltService {
    private static final Gson GSON = new Gson();

    public static Object transform(String entity, Object input) throws IOException {
      String jolt = FunctionUtils.getRequestXml(JoltService.class.getClassLoader().getResource(entity + ".json"));
        try {
          Object result = getSpecs(jolt).transform(input);
          if(result == null) {
            return Collections.emptyMap();
          }
          if (!(result instanceof List) && ((HashMap) result).containsKey("tmp")) {
            return new ArrayList<>();
          }
          return result;
        }
        catch (Exception e) {
            throw new TransformationException(e);
        }
    }

    private static Chainr getSpecs(String input) {
        Object event = GSON.fromJson(input, List.class);
        return new ChainrBuilder(event).withClassLoader(JoltService.class.getClassLoader()).build();
    }


}
