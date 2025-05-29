const userService = require('../services/userService');

const getUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
};

const addUser = async (req, res) => {
    try {
        const { nombre, contrasena, rol = 'cliente' } = req.body;
        if (!nombre || !contrasena) {
            return res.status(400).json({ error: 'Nombre y contraseña son requeridos' });
        }
        const newUser = await userService.createUser(nombre, contrasena, rol);
        if (newUser.error) {
            return res.status(400).json({ error: newUser.error });
        }
        res.status(201).json({ mensaje: 'Usuario creado exitosamente', usuario: newUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al crear usuario' });
    }
};

const updateUser = async (req, res) => {
    try {
        const id = req.params.id;
        const { nombre, contrasena, rol } = req.body;
        const updatedUser = await userService.updateUser(id, nombre, contrasena, rol);
        if (!updatedUser) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json({ mensaje: 'Usuario actualizado exitosamente', usuario: updatedUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al actualizar usuario' });
    }
};

const removeUser = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedUser = await userService.deleteUser(id);
        if (!deletedUser) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json({ mensaje: 'Usuario eliminado exitosamente' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
};

module.exports = {
    getUsers,
    addUser,
    updateUser,
    removeUser
};