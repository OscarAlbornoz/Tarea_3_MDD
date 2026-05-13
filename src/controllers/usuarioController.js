/**
 * Controlador de Usuarios
 * Maneja las peticiones HTTP relacionadas con usuarios
 */

const { sendSuccess, sendError } = require('../handlers/responseHandler');
const usuarioService = require('../services/usuarioService');
const { createUsuarioSchema, updateUsuarioSchema } = require('../validations/usuarioValidation');

/**
 * POST /usuarios
 * Crea un nuevo usuario
 */
const crearUsuario = async (req, res) => {
  try {
    // 1. Validamos los datos de entrada con Joi
    const { error, value } = createUsuarioSchema.validate(req.body);

    if (error) {
      return sendError(
        res,
        'Error en validación de datos',
        400,
        error.details.map(err => err.message)
      );
    }

    // 2. Llamamos al servicio para crear el usuario
    const usuarioCreado = await usuarioService.crearUsuario(value);

    // 3. Respondemos con éxito
    return sendSuccess(
      res,
      usuarioCreado,
      'Usuario creado exitosamente',
      201
    );
  } catch (error) {
    console.error(error);
    return sendError(res, 'Error al crear usuario', 500);
  }
};

/**
 * GET /usuarios
 * Obtiene todos los usuarios
 */
const obtenerTodosLosUsuarios = async (req, res) => {
  try {
    const usuarios = await usuarioService.obtenerTodosLosUsuarios();
    return sendSuccess(res, usuarios);
  } catch (error) {
    return sendError(res, 'Error al obtener usuarios', 500);
  }
};

/**
 * GET /usuarios/:id
 * Obtiene un usuario específico por ID
 */
const obtenerUsuarioPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await usuarioService.obtenerUsuarioPorId(id);

    if (!usuario) {
      return sendError(res, 'Usuario no encontrado', 404);
    }

    return sendSuccess(res, usuario);
  } catch (error) {
    return sendError(res, 'Error al obtener usuario', 500);
  }
};

/**
 * PATCH /usuarios/:id
 * Actualiza un usuario existente
 */
const actualizarUsuario = async (req, res) => {
  try {
    const { error, value } = updateUsuarioSchema.validate(req.body);

    if (error) {
      return sendError(res, error.details[0].message, 400);
    }

    const { id } = req.params;

    const usuarioActualizado = await usuarioService.actualizarUsuario(id, value);

    if (!usuarioActualizado) {
      return sendError(res, 'Usuario no encontrado', 404);
    }

    return sendSuccess(res, usuarioActualizado);
  } catch (error) {
    return sendError(res, 'Error al actualizar usuario', 500);
  }
};

/**
 * DELETE /usuarios/:id
 * Elimina un usuario
 */
const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const eliminado = await usuarioService.eliminarUsuario(id);

    if (!eliminado) {
      return sendError(res, 'Usuario no encontrado', 404);
    }

    return sendSuccess(res, { message: 'Usuario eliminado correctamente' });
  } catch (error) {
    return sendError(res, 'Error al eliminar usuario', 500);
  }
};

module.exports = {
  crearUsuario,
  obtenerTodosLosUsuarios,
  obtenerUsuarioPorId,
  actualizarUsuario,
  eliminarUsuario
};
