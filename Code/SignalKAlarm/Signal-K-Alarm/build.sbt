enablePlugins(ScalaJSPlugin)

name := "Signal-K-Alarm"

version := "0.1"

scalaVersion := "2.12.10"

jsDependencies += "org.webjars" % "jquery" % "2.2.1" / "jquery.js" minified "jquery.min.js"
libraryDependencies += "org.querki" %%% "jquery-facade" % "1.2"
libraryDependencies += "org.scala-js" %%% "scalajs-dom" % "0.9.7"
//libraryDependencies += "com.typesafe.play" %% "twirl-api" %"1.5.0"
libraryDependencies += "org.scala-lang.modules" %% "scala-parser-combinators" % "1.1.2"
libraryDependencies += "org.typelevel"  %% "squants"  % "1.6.0"

// This is an application with a main method
scalaJSUseMainModuleInitializer := true

skip in packageJSDependencies := false
jsDependencies += "org.webjars" % "jquery" % "2.2.1" / "jquery.js" minified "jquery.min.js"

jsEnv := new org.scalajs.jsenv.jsdomnodejs.JSDOMNodeJSEnv()



