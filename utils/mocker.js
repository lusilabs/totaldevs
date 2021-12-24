import faker from 'faker'

export const FakeName = () => {
  console.log(faker.name.findName())
}
function getRandomInt (max) {
  return Math.floor(Math.random() * max)
}

export const mockProduct = () => ({
  id: faker.datatype.uuid(),
  name: faker.commerce.productName(),
  title: faker.commerce.productName(),
  price: getRandomInt(50),
  description: faker.commerce.productDescription(),
  department: faker.commerce.productName(),
  website: faker.internet.url(),
  username: faker.internet.userName(),
  profilePhoto: faker.internet.avatar(),
  img: faker.image.image(),
  image: faker.image.image(),
  alt: faker.lorem.text(),
  email: faker.internet.email(),
  createdAt: faker.date.past(2),
  lastSeen: faker.date.between(faker.date.past(2), new Date())
})

export const mockProducts = num => [...Array(num).keys()].map(n => mockProduct(n))
