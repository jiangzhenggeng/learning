import linkList from "./linkList";

let links = new linkList()
links.append(1)
links.append(2)
links.append(3)
links.insert(4, 2)

console.log(links.head)