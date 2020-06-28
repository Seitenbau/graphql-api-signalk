package de.htwg.signalk

import org.scalatest.wordspec.AnyWordSpec
import org.scalatest.matchers.should.Matchers
import squants.motion.{KilometersPerHour, Knots}
import squants.time.{Hours, Minutes}
import squants.{Meters, Percent}
import squants.space.{Degrees, Feet, Kilometers, NauticalMiles}
import squants.thermal.Celsius


class RuleParserSpec extends AnyWordSpec with Matchers{

  val parser = new RuleParser

  "A Time Expression 'timeExp' " should {
    "accept expressions of the form '19:59'" in {
      parser.parse(parser.timeExp, "0:00").get should be(Hours(0)+Minutes(0))
      parser.parse(parser.timeExp, "00:00").get should be(Hours(0)+Minutes(0))
      parser.parse(parser.timeExp, "1:00").get should be(Hours(1)+Minutes(0))
      parser.parse(parser.timeExp, "02:01").get should be(Hours(2)+Minutes(1))
      parser.parse(parser.timeExp, "11:59").get should be(Hours(11)+Minutes(59))
      parser.parse(parser.timeExp, "12:15").get should be(Hours(12)+Minutes(15))
      parser.parse(parser.timeExp, "19:59").get should be(Hours(19)+Minutes(59))
      parser.parse(parser.timeExp, "20:00").get should be(Hours(20)+Minutes(0))
      parser.parse(parser.timeExp, "23:59").get should be(Hours(23)+Minutes(59))
      parser.parse(parser.timeExp, "19:59").get should be(Hours(19)+Minutes(59))
    }

    "not accept expressions of different forms like ' 0.00' or '25:61'" in {
      parser.parse(parser.timeExp, "0.00").successful should be(false)
      parser.parse(parser.timeExp, "00 00").successful should be(false)
      parser.parse(parser.timeExp, "59").successful should be(false)
      parser.parse(parser.timeExp, "000:00").successful should be(false)
      parser.parse(parser.timeExp, "12:1").successful should be(false)
      parser.parse(parser.timeExp, "19:61").successful should be(false)
      parser.parse(parser.timeExp, "25:00").successful should be(false)
      parser.parse(parser.timeExp, "35:00").successful should be(false)
      parser.parse(parser.timeExp, "23:61").successful should be(false)
    }
  }

  "A Time Clause 'timeClause' " should {
    "accept expressions of the form 'time is 19:59" in {
      parser.parse(parser.timeClause, "time is 19:50").get.check(Hours(19)+Minutes(50)) should be(true)
    }
    "not accept expressions with negative time" in {
      parser.parse(parser.timeClause, "time is -19:59").successful should be(false)
    }
  }

  "A Timer Clause 'timerClause' " should {
    "accept expressions of the form 'timer is 19:59' " in {
      parser.parse(parser.timerClause, "timer is 19:50").get.check(Hours(19)+Minutes(50)) should be(true)
    }
    "accept negative times of the form 'timer is -05:00' " in {
      parser.parse(parser.timerClause, "timer is -05:00").get.check(-1*Hours(5)) should be(true)
      parser.parse(parser.timerClause, "timer is - 0:05").get.check(-1*Minutes(5)) should be(true)
    }
  }

  "A Depth Clause ‘depthClause' " should {
    "accept expressions of the form 'value of Depth is below 5m' " in {
      parser.parse(parser.depthClause, "value of Depth is below 5m").get.check(Meters(10)) should be(false)
      parser.parse(parser.depthClause, "value of Depth is below 5m").get.check(Meters(2)) should be(true)
      parser.parse(parser.depthClause, "value of Depth is above 100 m").get.check(Meters(102)) should be(true)
      parser.parse(parser.depthClause, "value of Depth is below 20 ft").get.check(Feet(2)) should be(true)
      parser.parse(parser.depthClause, "value of Depth is between 2m and 5 m").get.check(Meters(3)) should be(true)
      parser.parse(parser.depthClause, "value of Depth is between 2m and 5 m").get.check(Meters(10)) should be(false)
      parser.parse(parser.depthClause, "value of Depth is outside 2m and 5 m").get.check(Meters(3)) should be(false)
      parser.parse(parser.depthClause, "value of Depth is outside 2m and 5 m").get.check(Meters(10)) should be(true)
    }
  }

  "A Distance Clause ‘distanceClause' " should {
    "accept expressions of the form 'distance to Marker is above 5 nm' " in {
      parser.parse(parser.distanceClause, "distance to Marker is above 500 m").successful should be(true)
      parser.parse(parser.distanceClause, "distance to Waypoint is below 120 m").successful should be(true)
      parser.parse(parser.distanceClause, "distance to Photo is between 900 m and 2500 m").successful should be(true)
      parser.parse(parser.distanceClause, "distance to Marker is above 5 km").successful should be(true)
      parser.parse(parser.distanceClause, "distance to Waypoint is below 1.20 nm").successful should be(true)
      parser.parse(parser.distanceClause, "distance to Photo is between 0.9 km and 2.5 km").successful should be(true)
    }
  }
  "A Speed Clause 'speedClause' " should {
    "accept expressions of the form 'value of SOG is above 8 kn' " in {
      parser.parse(parser.speedClause, "value of SOG is above 8 kn").get.check(Knots(10)) should be(true)
      parser.parse(parser.speedClause, "value of SOG is above 8 kn").get.check(Knots(6)) should be(false)
      parser.parse(parser.speedClause, "value of SOG is above 8 kn").get.check(KilometersPerHour(20)) should be(true)
    }
  }

  "A Temperature Clause 'tempClause' " should {
    "accept expressions of the form 'value of Air is above 28°C'" in {
      parser.parse(parser.tempClause, "value of Air is above 28°C").get.check(Celsius(30)) should be(true)
    }
  }

  "An Angle Clause ‘angleClause' " should {
    "accept expressions of the form 'value of COG is below 100°' " in {
      parser.parse(parser.angleClause, "value of COG is below 100°").get.check(Degrees(90)) should be(true)
      parser.parse(parser.angleClause, "value of COG is below 100°").get.check(Degrees(110)) should be(false)
      parser.parse(parser.angleClause, "value of COG is above 100°").get.check(Degrees(110)) should be(true)
      parser.parse(parser.angleClause, "value of COG is above 100°").get.check(Degrees(90)) should be(false)
      parser.parse(parser.angleClause, "value of COG is above 360°").get.check(Degrees(370)) should be(true)
      //parser.parse(parser.angleClause, "value of COG is above 360°").get.check(Degrees(10)) should be(true)
      parser.parse(parser.angleClause, "value of COG is between 0° and 90°").get.check(Degrees(45)) should be(true)
      parser.parse(parser.angleClause, "value of COG is between 0° and 90°").get.check(Degrees(100)) should be(false)
      parser.parse(parser.angleClause, "value of COG is outside 0° and 90°").get.check(Degrees(45)) should be(false)
      parser.parse(parser.angleClause, "value of COG is outside 0° and 90°").get.check(Degrees(100)) should be(true)
    }
  }
  "A Percent Clause 'percentClause' " should {
    "accept expressions of the form ' value of Battery is below 10%" in {
      parser.parse(parser.percentClause, "value of Battery is below 10%").get.check(Percent(9)) should be(true)
    }
  }
  "A Trigger" should {
    "accept time clauses" in {
      parser.parse(parser.trigger, "When timer is 19:00").successful should be(true)
      parser.parse(parser.trigger, "When time is 8:00").successful should be(true)
    }
    "accept Depth clauses" in {
      parser.parse(parser.trigger, "When value of Depth is below 10m").successful should be(true)
    }
    "accept Angle clauses" in {
      parser.parse(parser.trigger, "When value of TWA is below 270°").successful should be(true)
      parser.parse(parser.trigger, "When value of COG is outside 200° and 270°").successful should be(true)
    }
    "accept Distance clauses" in {
      parser.parse(parser.trigger, "When distance to Marker is above 500 m").successful should be(true)
      parser.parse(parser.trigger, "When distance to Waypoint is below 120 m").successful should be(true)
    }
  }
}
