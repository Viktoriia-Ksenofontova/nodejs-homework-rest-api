const path = require('path');
const createFolderIsNotExist = require('../helpers/create-dir');
const {rename, access, unlink} = require('fs/promises');
const Jimp = require('jimp');

class LocalUpload{
  constructor(AVATARS_OF_USERS) {
  this.AVATARS_OF_USERS=AVATARS_OF_USERS
  }
  
  async transformAvatar(pathFile) {
    const file = await Jimp.read(pathFile);
    await file
      .autocrop()
      .cover(250, 250, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE)
      .writeAsync(pathFile)
  }

  async saveAvatarToStatic({idUser, pathFile, name, oldFile}) {
    await this.transformAvatar(pathFile)
    const folderUserAvatar = path.join('public', this.AVATARS_OF_USERS);
    await createFolderIsNotExist(folderUserAvatar);
    await rename(pathFile, path.join(folderUserAvatar, name));
    await this.deleteOldAvatar(path.join(process.cwd(), 'public', oldFile))
    
    const avatarURL = path.normalize(path.join(this.AVATARS_OF_USERS, name));
    return avatarURL
  }
  async deleteOldAvatar(pathFile) {
    try {
      await unlink(pathFile)
    } catch (error) {
      console.log(error.message)
    }
  }
}

module.exports = LocalUpload