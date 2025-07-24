import vitamins from "../assets/medicine/vitamins.png"
import syrup from "../assets/medicine/syrup.png"
import tablets from "../assets/medicine/tablets.png"
import supplement from "../assets/medicine/supplement.png"
import pills2 from "../assets/medicine/pills-2.png"
import patches from "../assets/medicine/patches.png"
import ointment from "../assets/medicine/ointment.png"
import injection from "../assets/medicine/injection.png"
import inhaler from "../assets/medicine/inhaler.png"
import foodSupplement from "../assets/medicine/food-supplement.png"
import eyeDrops from "../assets/medicine/eye-drops.png"
import drops from "../assets/medicine/drops.png"
import capsule from "../assets/medicine/capsule.png"

import HappyOutline from "../assets/moods/happy_no.png"
import HappyColor from "../assets/moods/happy_yes.png"
import SadOutline from "../assets/moods/sad_no.png"
import SadColor from "../assets/moods/sad_yes.png"
import CalmOutline from "../assets/moods/calm_no.png"
import CalmColor from "../assets/moods/calm_yes.png"
import SickOutline from "../assets/moods/sick_no.png"
import SickColor from "../assets/moods/sick_yes.png"
import AngryOutline from "../assets/moods/angry_no.png"
import AngryColor from "../assets/moods/angry_yes.png"

import BreakfastOutline from "../assets/habits/breakfast_no2.png"
import BreakfastColor from "../assets/habits/breakfast_yes2.png"
import WaterOutline from "../assets/habits/water_no.png"
import WaterColor from "../assets/habits/water_yes.png"
import LunchOutline from "../assets/habits/lunch_no2.png"
import LunchColor from "../assets/habits/lunch_yes2.png"
import ExerciseOutline from "../assets/habits/exercise_no.png"
import ExerciseColor from "../assets/habits/exercise_yes.png"
import DinnerOutline from "../assets/habits/dinner_no2.png"
import DinnerColor from "../assets/habits/dinner_yes2.png"

import HeadacheOutline from "../assets/symptoms/headache_no.png"
import HeadacheColor from "../assets/symptoms/headache_yes.png"
import ColdOutline from "../assets/symptoms/cold_no.png"
import ColdColor from "../assets/symptoms/cold_yes.png"
import FeverOutline from "../assets/symptoms/fever_no.png"
import FeverColor from "../assets/symptoms/fever_yes.png"
import CoughOutline from "../assets/symptoms/cough_no.png"
import CoughColor from "../assets/symptoms/cough_yes.png"
import VomitOutline from "../assets/symptoms/vomiting_no.png"
import VomitColor from "../assets/symptoms/vomiting_yes.png"

export const medicinePictures = [
  { id: "1", source: vitamins, name: "Vitamins" },
  { id: "2", source: syrup, name: "Syrup" },
  { id: "3", source: tablets, name: "Tablets" },
  // { id: "4", source: supplement, name: "Supplement" },
  { id: "5", source: pills2, name: "Pills" },
  { id: "6", source: capsule, name: "Capsule" },
  { id: "7", source: patches, name: "Patches" },
  { id: "8", source: ointment, name: "Ointment" },
  { id: "9", source: injection, name: "Injection" },
  { id: "10", source: inhaler, name: "Inhaler" }, 
  { id: "11", source: drops, name: "Drops" },
  // { id: "11", source: foodSupplement, name: "Food Supplement" },
  // { id: "12", source: eyeDrops, name: "Eye Drops" },
];

export const days = ["S", "M", "T", "W", "T", "F", "S"]

export const dayMapping = [
  { key: 'Sunday', value: 0 },
  { key: 'Monday', value: 1 },
  { key: 'Tuesday', value: 2 },
  { key: 'Wednesday', value: 3 },
  { key: 'Thursday', value: 4 },
  { key: 'Friday', value: 5 },
  { key: 'Saturday', value: 6 }
];

export const moods = [
  { id: "happy", color: HappyColor, outline: HappyOutline, name: "Happy" },
  { id: "sad", color: SadColor, outline: SadOutline,name: "Sad" },
  { id: "calm", color: CalmColor, outline: CalmOutline, name: "Calm" },
  { id: "sick", color: SickColor, outline: SickOutline ,name: "Feeling sick" },
  { id: "angry", color: AngryColor, outline: AngryOutline, name: "Angry" }
];

export const habits = [
  { id: "breakfast", color: BreakfastColor, outline: BreakfastOutline, name: "Breakfast" },
  { id: "water", color: WaterColor, outline: WaterOutline,name: "Drink water" },
  { id: "lunch", color: LunchColor, outline: LunchOutline, name: "Lunch" },
  { id: "exercise", color: ExerciseColor, outline: ExerciseOutline ,name: "Exercise" },
  { id: "dinner", color: DinnerColor, outline: DinnerOutline, name: "Dinner" }
];

export const symptoms = [
  { id: "headache", color: HeadacheColor, outline: HeadacheOutline, name: "Headache" },
  { id: "cold", color: ColdColor, outline: ColdOutline,name: "Cold" },
  { id: "fever", color: FeverColor, outline: FeverOutline, name: "Fever" },
  { id: "cough", color: CoughColor, outline: CoughOutline ,name: "Cough" },
  { id: "vomit", color: VomitColor, outline: VomitOutline, name: "Vomiting" }
];