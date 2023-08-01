import { Gender } from '../stores/useCrew';

export const CrewMaleFirstNames = [
  'Max',
  'Dave',
  'Alex',
  'John',
];

const getMaleFirstName = () => {
  return CrewMaleFirstNames[Math.floor(Math.random() * CrewMaleFirstNames.length)];
};

export const CrewFemaleFirstNames = [
  'Nina',
  'Courtney',
  'Jess',
  'Sophie',
];

const getFemaleFirstName = () => {
  return CrewFemaleFirstNames[Math.floor(Math.random() * CrewFemaleFirstNames.length)];
};

export const getRandomFirstName = (gender: Gender) => {
  return gender === Gender.Male ? getMaleFirstName() : getFemaleFirstName();
};

export const CrewLastNames = [
  'Dustwalker',
  'Skyscanner',
  'Solarix',
  'Lightbringer',
  'Lunarcrawler',
];

export const getRandomLastName = () => {
  return CrewLastNames[Math.floor(Math.random() * CrewLastNames.length)];
};
