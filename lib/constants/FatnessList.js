const fatnessAvatarPath = process.env.images + 'fatnessAvatars/';

exports.fatnessList = [
  {
      size: 'slim',
      frenchDescription: 'maigre',
      maxTresholdIMC: 18.5,
      avatarPath: fatnessAvatarPath + 'slim.png'
  },
  {
    size: 'normal',
    frenchDescription: 'corpulence normale',
    maxTresholdIMC: 25,
    avatarPath: fatnessAvatarPath + 'normal.png'
  },
  {
    size: 'overweigth',
    frenchDescription: 'surpoids',
    maxTresholdIMC: 30,
    avatarPath: fatnessAvatarPath + 'overweight.png'
  },
  {
    size: 'obese',
    frenchDescription: 'obèse',
    maxTresholdIMC: 35,
    avatarPath: fatnessAvatarPath + 'obese.png'
  }
];