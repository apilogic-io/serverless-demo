package com.eturia.clients.common.parsers;


import javax.xml.stream.XMLEventReader;
import javax.xml.stream.XMLInputFactory;
import javax.xml.stream.events.Attribute;
import javax.xml.stream.events.EndElement;
import javax.xml.stream.events.StartElement;
import javax.xml.stream.events.XMLEvent;
import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;
import java.util.*;

import static com.eturia.clients.common.FunctionUtils.represent;

public class XmlParser {

  public static Map<String, Object> parse(String xml, XmlParserConfig xmlParserConfig) throws Exception {
    byte[] byteArray = xml.getBytes(StandardCharsets.UTF_8);
    ByteArrayInputStream inputStream = new ByteArrayInputStream(byteArray);
    XMLInputFactory xmlInputFactory = XMLInputFactory.newInstance();
    XMLEventReader reader = xmlInputFactory.createXMLEventReader(inputStream);
    ArrayDeque<XmlPath> path = new ArrayDeque<>();
    Map<String, Object> jsonMapping = new HashMap<>();
    while (reader.hasNext()) {
      XMLEvent nextEvent = reader.nextEvent();
      if (nextEvent.isStartElement()) {
        extracted(reader, path, xmlParserConfig.getMove(), nextEvent);
      }
      if (nextEvent.isEndElement()) {
        EndElement elementElement = nextEvent.asEndElement();
        if(elementElement.getName().getLocalPart().equals(xmlParserConfig.getContextPath())) {
          represent(path.getLast(), xmlParserConfig.getArrayPaths(), jsonMapping);
        }
        path.removeLast();
      }
    }
    return jsonMapping;
  }

  private static void extracted(XMLEventReader reader,
                                ArrayDeque<XmlPath> path,
                                List<Map<String, Integer>> move,
                                XMLEvent nextEvent) {
    StartElement startElement = nextEvent.asStartElement();
    XmlPath xmlPath = new XmlPath(startElement.getName().getLocalPart(), path, move);
    path.addLast(xmlPath);
    Map<String, String> values = getValues(reader, startElement, path, move);
    xmlPath.setValues(values);
  }

  private static Map<String, String> getValues(XMLEventReader reader,
                                               StartElement startElement,
                                               ArrayDeque<XmlPath> path,
                                               List<Map<String, Integer>> move) {
    Map<String, String> attrValues = getAttributesValues(startElement);
    XMLEvent next;
    try {
      next = reader.nextEvent();
      if (next.isCharacters()) {
        String value = String.valueOf(next.asCharacters().getData());
        String attrKey = startElement.getName().getLocalPart();
        if (isaValueNode(value.replaceAll("\\s+", ""))) {
          attrValues.put(attrKey, value);
        }
      } else {
        if(next.isStartElement()) {
          extracted(reader, path, move, next);
        }
        else if (next.isEndElement()) {
          if (!path.isEmpty()) {
            path.removeLast();
          }
        }
      }
    } catch (Exception e) {
      e.printStackTrace();
    }
    return attrValues;
  }

  @SuppressWarnings("unchecked")
  private static Map<String, String> getAttributesValues(StartElement startElement) {
    Map<String, String> attributeValues = new HashMap<>();
    Iterator<Attribute> attributeIterator = startElement.getAttributes();
    while (attributeIterator.hasNext()) {
      Attribute attribute = attributeIterator.next();
      attributeValues.put(attribute.getName().getLocalPart(), attribute.getValue());
    }
    return attributeValues;
  }

  private static boolean isaValueNode(String temp) {
    return temp != null && !temp.isEmpty();
  }


}
