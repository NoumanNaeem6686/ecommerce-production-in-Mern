import mongoose from "mongoose";
import colors from "colors";

const connection = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(
      `connecting to mongoDb database ${conn.connection.host}`.bgMagenta.white
    );
  } catch (error) {
    console.log(`Error while connecting database ${error}`.bgRed.white);
  }
};

export default connection;
