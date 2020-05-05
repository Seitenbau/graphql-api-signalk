package de.htwg.signalk

import squants.motion.{KilometersPerHour, Knots, MetersPerSecond, Velocity}
import squants.space._
import squants.thermal.{Celsius, Fahrenheit, Temperature}
import squants.time.{Hours, Minutes, Time}
import squants.{Angle, Dimensionless, Meters, Percent}

import scala.util.parsing.combinator.RegexParsers

class RuleParser extends RegexParsers {

  def sign = "[-]".r ^^ { _ => -1 }
  def hour01 = ("([0-1])?[0-9]".r ~ ":") ^^ { case string ~ _ => Hours(string.toInt) }
  def hour2 = ("2[0-3]".r ~ ":") ^^ { case string ~ _ => Hours(string.toInt) }
  def hour = hour01 | hour2
  def minute = "[0-5][0-9]".r ^^ { string => Minutes(string.toInt) }
  def timeExp = hour ~ minute ^^ { case hours ~ minutes => hours + minutes }
  def timeClause = "time" ~ "is" ~ timeExp ^^ { case t ~ _ ~ time => new Trigger[Time](t, TimeOperator[Time].is(time)(_)) }
  def timerClause = "timer" ~ "is" ~ opt(sign) ~ timeExp ^^ { case t ~ _ ~ sign ~ time => new Trigger[Time](t, TimeOperator[Time].is(sign.getOrElse(1) * time)(_)) }

  def depthExp = DepthParser().argExp.asInstanceOf[Parser[Length => Boolean]]
  def depthClause = "value" ~ "of" ~ "Depth" ~ "is" ~ depthExp ^^ { case _ ~ _ ~ depth ~ _ ~ depthExp => new DepthTrigger(depth, depthExp) }

  def speedExp = SpeedParser().argExp.asInstanceOf[Parser[Velocity => Boolean]]
  def speedType = "SOG" | "STW" | "AWS" | "TWS" | "VMG"
  def speedClause = "value" ~ "of" ~ speedType ~ "is" ~ speedExp ^^ { case _ ~ _ ~ speedType ~ _ ~ speedExp => new Trigger[Velocity](speedType, speedExp) }

  def distanceExp = DistanceParser().argExp.asInstanceOf[Parser[Length => Boolean]]
  def distanceType = "Marker" | "LogEntry" | "Photo" | "Waypoint"
  def distanceClause = "distance" ~ "to" ~ distanceType ~ "is " ~ distanceExp ^^ { case _ ~ _ ~ distanceType ~ _ ~ distance => new Trigger[Length](distanceType, distance) }

  def angleExp = AngleParser().argExp.asInstanceOf[Parser[Angle=>Boolean]]
  def angleType = "TWA" | "TWD" | "AWA" | "AWD" | "HDG" | "COG" | "CTW"
  def angleClause = "value" ~ "of" ~ angleType ~ "is" ~ angleExp ^^ { case _ ~ _ ~ angleType ~ _ ~ angleExp => new Trigger[Angle](angleType, angleExp) }

  def percentExp = PercentParser().argExp.asInstanceOf[Parser[Dimensionless => Boolean]]
  def percentType = "Battery" | "Fuel" | "Performance"
  def percentClause = "value" ~ "of" ~ percentType ~ "is" ~ percentExp ^^ { case _ ~ _ ~ percentType ~ _ ~ percentExp => new Trigger[Dimensionless](percentType, percentExp) }

  def tempExp =  TempParser().argExp.asInstanceOf[Parser[Temperature=>Boolean]]
  def tempType = "Air" | "Water" | "Engine"
  def tempClause = "value" ~ "of" ~ tempType ~ "is" ~ tempExp ^^ { case _ ~ _ ~ tempType ~ _ ~ tempExp => new Trigger[Temperature](tempType, tempExp) }

  def lengthTrigger = "When" ~ (distanceClause | depthClause) ^^ { case _ ~ trigger => Rule(trigger, new Action) }
  def timeTrigger = "When" ~ (timeClause | timerClause) ^^ { case _ ~ trigger => Rule(trigger, new Action) }
  def angleTrigger = "When" ~ angleClause ^^ { case _ ~ trigger => Rule(trigger, new Action) }
  def trigger = lengthTrigger | timeTrigger | angleTrigger

  abstract class OperatorParser[A<:Ordered[A]] extends RegexParsers {
    def valueHole = "[0-9]{1,5}".r ^^ { case numString => numString.toInt }
    def valueFracture = "." ~ "[0-9]{1,3}".r ^^ { case "." ~ fract => fract.toDouble / scala.math.pow(10, fract.length) }
    def value = valueHole ~ opt(valueFracture) ^^ { case hole ~ fract => hole.toDouble + fract.getOrElse(0.0) }
    def sign = "[-]".r ^^ { _ => -1 }
    def signedValue = opt(sign) ~ value ^^ { case sign ~ value => sign.getOrElse(1) * value }
    def oneArgOp = "below" | "above"
    def twoArgOp = "between" | "outside"
    def unitValue:Parser[A]
    def oneArgExp = oneArgOp ~ unitValue ^^ {
      case "below" ~ value => OrderOperator[A].below(value)(_)
      case "above" ~ value => OrderOperator[A].above(value)(_)
    }
    def twoArgExp = twoArgOp ~ unitValue ~ "and" ~ unitValue ^^ {
      case "between" ~ valueA ~ "and" ~ valueB if valueA < valueB => OrderOperator[A].between(valueA, valueB)(_)
      case "outside" ~ valueA ~ "and" ~ valueB if valueA < valueB => OrderOperator[A].outside(valueA, valueB)(_)
    }
    def argExp = oneArgExp | twoArgExp
  }
  case class DepthParser() extends OperatorParser[Length] {
    def unitValue = value ~ ("m" | "ft") ^^ {
      case value ~ "m" => Meters(value)
      case value ~ "ft" => Feet(value)
    }
  }
  case class DistanceParser() extends OperatorParser[Length] {
    def unitValue = value ~ ("m" | "ft" | "km" | "nm") ^^ {
      case value ~ "m" => Meters(value)
      case value ~ "ft" => Feet(value)
      case value ~ "km" => Kilometers(value)
      case value ~ "nm" => NauticalMiles(value)
    }
  }
  case class SpeedParser() extends OperatorParser[Velocity] {
    def unitValue = value ~ ("kn" | "m/s" | "km/h") ^^ {
      case value ~ "kn" => Knots(value)
      case value ~ "m/s" => MetersPerSecond(value)
      case value ~ "km/h" => KilometersPerHour(value)
    }
  }
  case class AngleParser() extends OperatorParser[Angle] {
    def unitValue = signedValue ~ ("°") ^^ {
      case value ~ "°" => Degrees(value)
    }
  }
  case class PercentParser() extends OperatorParser[Dimensionless] {
    def unitValue = value ~ ("%") ^^ {
      case value ~ _ => Percent(value)
    }
  }
  case class TempParser() extends OperatorParser[Temperature] {
    def unitValue = signedValue ~ ("°C" | "°F") ^^ {
      case value ~ "°C" => Celsius(value)
      case value ~ "°F" => Fahrenheit(value)
    }
  }
}