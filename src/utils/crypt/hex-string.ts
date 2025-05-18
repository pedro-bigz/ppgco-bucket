import { compareHexStrings } from './compareHexStrings';

export class HexString {
  constructor(private hexText: string) {}

  public compare(toCompareHex: string) {
    return compareHexStrings(toCompareHex, this.hexText);
  }
}
