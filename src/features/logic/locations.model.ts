import {
  sample,
  createEvent,
  createStore,
  createEffect,
} from 'effector';

import worldCities from 'worldcities';
import { City } from 'worldcities/lib/city';

export const $locations = createStore<City[]>([]);

export const $locationVariants = createStore<City[]>([]);

export const $inputValue = createStore<string>('');

export const changeInputValue = createEvent<string>();

export const addLocation = createEvent<City>();

export const deleteCity = createEvent<City>();

const getCitiesByNameFx = createEffect((inputValue: string) => {
  const loc = worldCities.getAllByName(inputValue);
  return loc;
});

const deleteCityFx = createEffect((allCities: City[], deletedCity: City) => {
  const cities = allCities.filter((city) => city !== deletedCity);

  return cities;
});

sample({
  clock: changeInputValue,
  target: $inputValue,
});

sample({
  clock: $inputValue,
  filter: (inputValue) => inputValue.length >= 3,
  target: getCitiesByNameFx,
});

sample({
  clock: getCitiesByNameFx.doneData,
  target: $locationVariants,
});

sample({
  clock: addLocation,
  source: $locations,
  fn: (allLocation, newLocation) => [...allLocation, newLocation],
  target: $locations,
});

sample({
  clock: deleteCity,
  source: $locations,
  target: deleteCityFx,
});

sample({
  clock: deleteCityFx.doneData,
  target: $locations,
});
