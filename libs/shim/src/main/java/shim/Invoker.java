package shim;

import com.google.gson.Gson;

import java.io.File;
import java.lang.reflect.Constructor;
import java.lang.reflect.Method;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLClassLoader;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.Scanner;
import java.util.stream.Collectors;

/**
 * Amplify Java Lambda Function shim
 * <p>
 * Loads lambda jar file, reads event from stdin and writes result on stdout
 */
public class Invoker {
  private static final Gson GSON = new Gson();

  private final Method handlerMethod;
  private final Object handlerInstance;

  public static void main(String[] args) throws Exception {
    final Invoker invoker = new Invoker(args[0], args[1], args[2]);
    invoker.start();
  }

  @SuppressWarnings({"unchecked", "rawtypes"})
  private Invoker(final String lambdaJarPath, final String handlerClassName, final String handlerMethodName) throws Exception {
    // load lambda handler

    URL classPathJars = new File(lambdaJarPath).toURI().toURL();
    final URLClassLoader child = new URLClassLoader(
      new URL[] {classPathJars},
      this.getClass().getClassLoader()
    );
    final Class classToLoad = Class.forName(handlerClassName, true, child);
    handlerMethod = Arrays.stream(classToLoad.getMethods())
      .filter(method -> method.getName().equals(handlerMethodName))
      .findFirst()
      .orElseThrow(() -> new IllegalStateException("Could not find handler method named " + handlerMethodName + " in class " + handlerClassName));
    Constructor<Class<?>> constructor = classToLoad.getConstructor();
    handlerInstance = constructor.newInstance();
  }

  // read event from stdin, invoke handler and return result on stdout
  private void start() throws Exception {
    // read event from stdin
    final Scanner scanner = new Scanner(System.in);
    final String eventString = scanner.nextLine();
    scanner.close();
    final Object event = GSON.fromJson(eventString, handlerMethod.getParameterTypes()[0]);

    // invoke the handler
    final Object response = handlerMethod.invoke(handlerInstance, event, new MockContext());
    System.out.println(); // print blank line to ensure lambda logs don't interfere
    System.out.println(GSON.toJson(response));
  }

  private List<URL> classPathJars(File[] files, String buildLibPath) {
    return Arrays.stream(files).map(file -> {
      if (file.isDirectory()) {
        File lib = new File(file.getAbsolutePath() + buildLibPath);
        if (lib.exists()) {
          try {
            return lib.toURI().toURL();
          } catch (MalformedURLException e) {
            return null;
          }
        }
      }
      return null;
    }).filter(Objects::nonNull).collect(Collectors.toList());
  }

}
