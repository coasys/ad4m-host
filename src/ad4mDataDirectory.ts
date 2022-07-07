import { homedir } from 'os'
import path from 'path'

export function ad4mDataDirectory(override = undefined) {
    if(override)
        return path.join(homedir(), override)
    else
        return path.join(homedir(), '.ad4m')
}