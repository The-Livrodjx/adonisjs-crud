import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import User from 'App/Models/User'

export default class UsersController {

  public async index() {

    return "Hello from UsersController"
  }

  public async getAll({response}: HttpContextContract) {
    const users = Database.from('users').select('id', 'email', 'username')

    if(users) return users

    response.status(406)
    return {msg: "Nenhum usuário encontrado"}
  }

  public async create({request, response}: HttpContextContract) {
    const {username, email, password} = request.only(["username", "email", "password"])

    const userExists = await User.findBy("email", email)

    if(!userExists) {

      const user = await User.create({
        username,
        email,
        password
      })

      return {msg: "Usuário criado com sucesso", user}
    }

    response.status(406)
    return {msg: "Usuário já criado"}
  }

  public async update({request, params, response} : HttpContextContract) {

    const {newUsername} = request.only(['newUsername'])

    const user = await User.findBy('id', params.id)
    if(user) {
      await user.merge({username: newUsername}).save()

      return {msg: "Usuário atualizado com sucesso", user}
    }

    response.status(406)

    return {msg: "Nenhum usuário encontrado"}
  }

  public async delete({params, response}: HttpContextContract) {

    const user = await User.findBy('id', params.id)

    if(user) {
      await user.delete()

      return {msg: "Usuário excluído com sucesso", user}
    }

    response.status(406)

    return {msg: "Não foi encontrado nenhum usuário para a exclusão"}
  }
}
