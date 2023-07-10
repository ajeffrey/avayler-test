// I've only included the fields we're currently interested in
// in the interface definition. To add more fields, please
// refer to https://github.com/r-spacex/SpaceX-API/blob/master/docs/launches/v5/all.md

interface LaunchCore {
  core: string;
}

interface LaunchFailure {
  time: number;
  altitude?: number;
  reason: string;
}

export interface Launch {
  id: string;
  name: string;
  date_utc: string;
  cores: LaunchCore[];
  payloads: string[];
  success: boolean;
  failures: LaunchFailure[];
  links: {
    patch: {
      small: string;
    }
  }
}

export interface Payload {
  id: string;
  type: string;
}

export interface Core {
  id: string;
  serial: string;
}