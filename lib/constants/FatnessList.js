const fatnessAvatarPath = process.env.images + 'fatness/avatars/';

exports.fatnessList = [
  {
      size: 'slim',
      frenchDescription: 'maigre',
      maxTresholdIMC: 18.5,
      avatarPath: fatnessAvatarPath + 'slim.PNG'
  },
  {
    size: 'normal',
    frenchDescription: ' de corpulence normale',
    maxTresholdIMC: 25,
    avatarPath: fatnessAvatarPath + 'normal.PNG'
  },
  {
    size: 'overweigth',
    frenchDescription: 'surpoids',
    maxTresholdIMC: 30,
    avatarPath: fatnessAvatarPath + 'overweight.PNG'
  },
  {
    size: 'obese',
    frenchDescription: 'obèse',
    maxTresholdIMC: 35,
    avatarPath: fatnessAvatarPath + 'obese.PNG'
  }
];