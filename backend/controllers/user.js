// Método de prueba
export const pruebaUser = (req,res) => {
    return res.status(200).json({
        status: 200,
        message: "Soy una acción de prueba desde: controllers/user.js"
    });
}