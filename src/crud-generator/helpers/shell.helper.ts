import { Injectable, Logger } from '@nestjs/common';
import { exec } from 'child_process';
import { paths } from '../crud-generator.constants';

@Injectable()
export class ShellHelper {
  public execute(command: string) {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          return reject
            ? reject({ error, stderr })
            : Logger.error(`error: ${error.message}`);
        }
        if (stderr) {
          return reject
            ? reject({ error, stderr })
            : Logger.error(`stderr: ${stderr}`);
        }

        Logger.log(stdout);
        resolve({ status: stdout });
      });
    });
  }

  public newFolder(name: string) {
    return this.execute(`mkdir ${name}`);
  }

  public newModuleDir(name: string) {
    return this.execute(
      `nest g resource ${name} < ${paths.generator.root}/${paths.generator.inputs}/module.in`,
    );
  }

  public newModule(name: string) {
    return this.execute(`nest g mo ${name}`);
  }

  public newController(name: string) {
    return this.execute(`nest g co ${name}`);
  }

  public newService(name: string) {
    return this.execute(`nest g s ${name}`);
  }
}
