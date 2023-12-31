import fs from 'fs/promises'

const databasePath = new URL('../TASKS_DB.json', import.meta.url)

export class DataBase {
  #database = {}

  constructor() {
    fs.readFile(databasePath, 'utf8').then(data => {
      this.#database = JSON.parse(data)
    })
      .catch(() => {
        this.#persist();
      })
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  select(table) {
    let data = this.#database[table] ?? []
    return data
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }

    this.#persist();

    return data
  }

  update(table, id, data) {
    if (!Array.isArray(this.#database[table])) return false;

    const rowIndex = this.#database[table].findIndex(row => row.id === id);

    if (rowIndex > -1) {
      this.#database[table][rowIndex] = {
        ...this.#database[table][rowIndex],
        title: data.title,
        description: data.description,
        updated_at: new Date(),
      }
      this.#persist();
      return true
    }

    return false
  }

  updateColumn(table, id, value, column) {
    if (!Array.isArray(this.#database[table])) return false;

    const rowIndex = this.#database[table].findIndex(row => row.id === id);

    if (rowIndex > -1) {
      this.#database[table][rowIndex] = {
        ...this.#database[table][rowIndex],
        [column]: value,
      }

      return true
    }

    return false
  }


  delete(table, id) {
    if (!Array.isArray(this.#database[table])) return false;

    const rowIndex = this.#database[table].findIndex(row => row.id === id);

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1)
      this.#persist();
      return true
    }

    return false
  }
}