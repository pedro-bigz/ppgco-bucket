import { Command, CommandRunner, Option } from 'nest-commander';
import {
  CrudGeneratorService,
  IndividualGenerateType,
} from './crud-generator.service';

// interface ModuleCommandArguments {
//   tableName: string;
// }

interface ModuleCommandOptions {
  force?: boolean;
  log?: boolean;
  only?: IndividualGenerateType;
}

@Command({
  name: 'module-generator',
  description: 'This command generate new modules with basic code structure',
})
export class CrudGeneratorCommand extends CommandRunner {
  public constructor(private readonly generatorService: CrudGeneratorService) {
    super();
  }

  async run(
    [tableName]: string[],
    options?: ModuleCommandOptions,
  ): Promise<void> {
    return this.generatorService.init(
      tableName.toLowerCase(),
      !!options?.force,
      !!options?.log,
      options?.only,
    );
  }

  @Option({
    flags: '-f, --force [force]',
    description: 'Force Generate Module',
  })
  parseForce(val: string): boolean {
    return !!val;
  }

  @Option({
    flags: '-l, --log [log]',
    description: 'Log Generate Module',
  })
  parseLog(val: string): boolean {
    return !!val;
  }

  @Option({
    flags: '-o, --only [only]',
    description: 'Generate Only parts',
  })
  parseOnly(val: string): IndividualGenerateType {
    return val as IndividualGenerateType;
  }
}
