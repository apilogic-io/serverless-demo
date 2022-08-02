package com.eturia.clients.common.entities;

public enum EntitiesEnum {
  COUNTRIES("countries", "http://parsec.es/NewAvailabilityServlet/staticdata/OTA2014A"),
  REGIONS("regions", "http://parsec.es/NewAvailabilityServlet/staticdata/OTA2014A"),
  CITIES("cities", "http://parsec.es/NewAvailabilityServlet/staticdata/OTA2014A"),
  HOTELS("hotels", "http://search.eturia.parsec.es/NewAvailabilityServlet/hotelavail/OTA2014Compact"),
  HOTEL_INFOS("hotelInfos", "http://parsec.es/NewAvailabilityServlet/hotelinfo/OTA2014A"),
  AVAILABLE_HOTELS("availableHotels", "http://search.eturia.parsec.es/NewAvailabilityServlet/hotelavail/OTA2014Compact"),
  PREBOOK_HOTEL("hotelPrebook", "http://parsec.es/NewAvailabilityServlet/hotelres/OTA2014Compact"),

  HOTEL_BOOKING("hotelBooking", "http://parsec.es/NewAvailabilityServlet/hotelres/OTA2014Compact"),
  HOTEL_BOOKING_INFO("hotelBookingInfo", "http://parsec.es/NewAvailabilityServlet/reservationsread/OTA2014Compact");


  private final String value;
  private final String soapEndpointUrl;

  EntitiesEnum(String value, String soapEndpointUrl) {
    this.value = value;
    this.soapEndpointUrl = soapEndpointUrl;
  }

  public String getSoapEndpointUrl() {
    return soapEndpointUrl;
  }

  public String getValue() {
    return value;
  }
}
