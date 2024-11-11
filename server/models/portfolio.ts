import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema({
  // user : { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  holdings: [
    {
      token: { type: String, required: true },
      quantity: { type: Number, required: true }
    }
  ]
});

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

export default Portfolio;