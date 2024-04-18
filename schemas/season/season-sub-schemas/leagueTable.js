import { Schema } from "mongoose";

const LeagueTableSchema = new Schema({
  teamName: String,
  teamAcronym: String,
  teamLogo: String,
  teamBanner: String,
  Manager: {
    type: String,
    default: "-"
  }
  ,
  GP: {
    type: Number,
    default: 0,
  },
  W: {
    type: Number,
    default: 0,
  },
  L: {
    type: Number,
    default: 0,
  },
  T: {
    type: Number,
    default: 0,
  },
  OTL: {
    type: Number,
    default: 0,
  },
  Pts: {
    type: Number,
    default: 0,
  },
  "Pts%": {
    type: String,
    default: ".000"
  },
  Gf: {
    type: Number,
    default: 0
  },
  Ga: {
    type: Number,
    default: 0
  },
  Diff: {
    type: Number,
    default: 0
  },
  Strk: {
    type: String,
    default: "-"
  },
  Last10: {
    lastTenArray: {
      type: [String],
      default: []
    },
    lastTenRecord: {
      W: {
        type: Number,
        default: 0
      },
      L: {
        type: Number,
        default: 0
      },
      T: {
        type: Number,
        default: 0
      },
      OTL: {
        type: Number,
        default: 0
      },
      Pts: {
        type: Number,
        default: 0
      },
    },
  },
  L10: {
    type: String,
    default: "(0-0-0-0)"
  },
  Gfa: {
    type: String,
    default: "0.00"
  },
  Gaa: {
    type: String,
    default: "0.00"
  },
  SO: {
    type: Number,
    default: 0
  },
  isTeamOnHiatus: {
    type: Boolean,
    default: false
  }
});

export default LeagueTableSchema;
