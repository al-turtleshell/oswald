import { promises as fs } from 'fs';
import { join, resolve } from 'path';

type EventInfo = {
    eventName: string;
    path: string;
  };

// Function to recursively find files
async function findFiles(directory: string, pattern: RegExp): Promise<string[]> {
    let filesList: string[] = [];

    async function find(directory: string) {
        const files = await fs.readdir(directory, { withFileTypes: true });
        for (const file of files) {
            if (file.isDirectory()) {
                await find(join(directory, file.name));
            } else if (pattern.test(file.name)) {
                filesList.push(join(directory, file.name));
            }
        }
    }

    await find(directory);

    return filesList;
}

function convertToCamelCase(paths: string[]): EventInfo[] {
    return paths.map(path => {
        // Extract the filename without the directory path
        const filename = path.split('/').pop()?.replace('.event.ts', '') ?? '';
        // Split the filename by '-' to work on converting it to camelCase
        const parts = filename.split('-');
        // Convert to camelCase
        return {eventName: parts.map((part) => {
            // Keep the first part in lowercase, capitalize the first letter of the subsequent parts
            return part.charAt(0).toUpperCase() + part.slice(1);
        }).join(''), path};
    });
}

function expandArrayWithFailedVariants(originalArray: EventInfo[]): EventInfo[]{
    let newArray: EventInfo[] = [];

    originalArray.forEach(item => {
        newArray.push(item); // Add the original item
        newArray.push({...item, eventName: `${item.eventName}Failed`}); // Add the item with "Failed" appended
    });

    return newArray;
}

function generateCode(events: EventInfo[]): string {
    let imports: Record<string, Set<string>> = {};
    let registry: string[] = [];
  
    events.forEach(({ eventName, path }) => {
      // Extract relative path and filename without extension
      const relativePath = path.replace(/^.*\/oswald\/(.*)\.event\.ts$/, "../../$1.event");
      if (!imports[relativePath]) {
        imports[relativePath] = new Set();
      }
      imports[relativePath].add(eventName);
      registry.push(`    "${eventName}": ${eventName},`);
    });
  
    // Generate import statements
    const importStatements = Object.entries(imports).map(([path, events]) =>
      `import { ${Array.from(events).join(", ")} } from "${path}";`
    ).join("\n");
  
    // Generate eventClassRegistry
    const registryObject = `const eventClassRegistry: Record<string, unknown> = {\n${registry.join("\n")}\n};\n\nexport { eventClassRegistry };`;
  
    return `${importStatements}\n\n${registryObject}`;
  }
  

async function updateEventRegistryFile(events: EventInfo[]): Promise<void> {
    
    const filePath = join(__dirname, '../../src/event/event-registry.ts');
    const code = generateCode(events);
  
    try {
      // Attempt to delete the file if it exists
      await fs.unlink(filePath);
      console.log('Existing file deleted successfully.');
    } catch (error: any) {
      // If the file does not exist, log and continue
      if (error.code !== 'ENOENT') { // ENOENT = Error NO ENTry (i.e., file not found)
        console.error('Error deleting the file:', error);
        return;
      } else {
        console.log('File does not exist, creating a new one.');
      }
    }
  
    try {
      // Write the generated code to the file
      await fs.writeFile(filePath, code, 'utf8');
      console.log('File written successfully with the generated code.');
    } catch (error) {
      console.error('Error writing the file:', error);
    }
  }
  
  


const main = async () => {
    const directoryToSearch = resolve('./'); // Adjust this path to the directory you want to search
    const pattern = /\.event\.ts$/; // Regex to match files ending with .event.ts

    const paths = await findFiles(directoryToSearch, pattern);
    const events = expandArrayWithFailedVariants(convertToCamelCase(paths));


    await updateEventRegistryFile(events);
}


await main();