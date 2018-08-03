'use strict'

module.exports = {
  getImage () {
    return {
      id: 'c36a62bb-f658-4361-a36b-75c0a8344d34',
      publicId: '5WK7zyN7QduZUDNSi1UkQY',
      userId: 'platzigram',
      likes: 0,
      liked: false,
      src: 'https://platzigram.test/5WK7zyN7QduZUDNSi1UkQY.jpg',
      description: '#awesome',
      tags: ['awesome'],
      createdAt: new Date().toString()
    }
  },

  getImages () {
    return [
      this.getImage(),
      this.getImage(),
      this.getImage()
    ]
  },

  getImagesByTag () {
    return [
      this.getImage(),
      this.getImage()
    ]
  },

  getUser () {
    return {
      id: '27bf489b-6b76-4ac0-95b5-f60979d136e8',
      name: 'Elliot Alderson',
      username: 'mr.robot',
      email: 'elliot@platzigram.test',
      password: 'pl4z1gr@m',
      createdAt: new Date().toString()
    }
  }
}
