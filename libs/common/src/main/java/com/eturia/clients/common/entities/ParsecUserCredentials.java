package com.eturia.clients.common.entities;

import java.util.Map;

public class ParsecUserCredentials {
  private Map<String, ParsecCredentials> usernames;

  public Map<String, ParsecCredentials> getUsernames() {
    return usernames;
  }

  public void setUsernames(Map<String, ParsecCredentials> usernames) {
    this.usernames = usernames;
  }
}
