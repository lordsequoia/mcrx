import mcrx from "../index"

const startDemo = (rootDir: string) => {
    const {logs$, loggedEvents$, playerEvents$} = mcrx(rootDir)

    const {playerJoined$, playerLeft$} = playerEvents$

    logs$.subscribe(v => console.log(`# -> [${v.timestamp}] ${v.content}`))
    loggedEvents$.stream$.subscribe(v => console.log(`E -> [${v.line.timestamp}] ${JSON.stringify(v.data, null, 2)}`))
    playerJoined$.subscribe(v => console.log(`J -> [${v.timestamp}] player joined: ${v.player.name}`))
    playerLeft$.subscribe(v => console.log(`L -> [${v.timestamp}] player left: ${v.player.name}`))
}

export default startDemo(process.argv[2])