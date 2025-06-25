const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema({
  destination: {
    type: String,
    required: true,
    immutable: true
  },
  arrivalDate: {
    type: Date,
    required: true,
    validate: {
      validator: function (v) {
        return v instanceof Date && !isNaN(v.getTime());
      },
      message: props => `${props.value} is not a valid arrival date!`
    }
  },
  departureDate: {
    type: Date,
    required: true,
    validate: {
      validator: function (v) {
        // departure must be after arrival
        return (
          v instanceof Date &&
          !isNaN(v.getTime()) &&
          this.arrivalDate &&
          v > this.arrivalDate
        );
      },
      message: props => `⏱️ Departure must be after arrival, not before!`

    }
  },
  experience: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  }
});

module.exports = mongoose.model('Journal', journalSchema);
