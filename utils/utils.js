export function setAddressComponents(place, addressComponents) {
  let componentPlace = {
    street_number: 'short_name',
    route: 'long_name',
    locality: 'long_name',
    administrative_area_level_1: 'short_name',
    country: 'long_name',
  };

  let keyAddressComponents = {
    street_number: 'street',
    route: 'street',
    locality: 'city',
    administrative_area_level_1: 'area',
    country: 'country',
  };

  for (let key in addressComponents) {
    addressComponents[key] = '';
  }

  for (let i = 0; i < place.address_components.length; i++) {
    let addressType = place.address_components[i].types[0];
    if (componentPlace[addressType]) {
      let value = place.address_components[i][componentPlace[addressType]];
      if (addressType == 'street_number') {
        addressComponents[keyAddressComponents[addressType]] += ('' + value);
      } else {
        addressComponents[keyAddressComponents[addressType]] = value;
      }
    }
  }

  addressComponents.geo_point = place.geometry.location.toString();
}