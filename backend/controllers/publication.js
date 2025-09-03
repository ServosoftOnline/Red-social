export const pruebaPublication = (req,res) => {
    return res.status(200).json({
        status: 200,
        message: "Soy una acción de prueba desde: controllers/publication.js"
    });
}