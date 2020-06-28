package de.htwg.signalk

import org.scalatest.matchers.should.Matchers
import org.scalatest.wordspec.AnyWordSpec
import squants.space.{Length, Meters}

class RuleSpec extends AnyWordSpec with Matchers{

  "the partially applied function 'above' partially applied to 5 m" should {
    val above5 = OrderOperator[Length].above(Meters(5))(_)
    "be true for 10m" in {
      above5(Meters(10)) should be(true)
    }
    "be false for 2m" in {
      above5(Meters(2)) should be(false)
    }
  }

}
