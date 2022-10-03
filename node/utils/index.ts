const getAnimalTypeId = (type: string) => {
    let animalId = 0;
    switch(type) {
      case 'dog': animalId = 1;
        break;
      case 'cat': animalId = 2;
        break;
      case 'fish': animalId = 5;
        break;
      case 'bird': animalId = 4;
        break;
      case 'rabbit': animalId = 3;
        break;
      case 'hamster': animalId = 3;
        break;
    }
    return animalId
  }


  export default getAnimalTypeId