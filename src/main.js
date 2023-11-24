const mysql = require('mysql2/promise')

class Logger {
  constructor() {
    this.levels = {
      info: 'Info',
      warning: 'Warning',
      error: 'Error',
			system: 'System'
    };

    this.colors = {
      Info: '\x1b[36m', // Cyan
      Warning: '\x1b[33m', // Yellow
      Error: '\x1b[31m', // Red
			System: '\x1b[1;31m', // Bold Red
      Reset: '\x1b[0m' // Reset color
    };

		this.pool = null;
  }

	async connect(config) {
		this.pool = mysql.createPool({
			host: config.host,
			user: config.user,
			database: config.database,
			password: config.password,
			port: config.port
		});
	}

  async send(obj) {
		if (!this.pool) {
      throw new Error('Your connection was not established, please connect to the database!');
    }

    const color = this.colors[obj.level] || this.colors.Reset;
		const message = `${obj.level} | ${obj.message}`

    console.log(`${color}%s${this.colors.Reset}`, message);

		switch (obj.level) {
			case this.levels.info:
				this.info(obj)
				break;
			case this.levels.warning:
				this.warning(obj)
				break;
			case this.levels.error:
				this.error(obj)
				break;
			case this.levels.system:
				this.system(obj)
				break;
			default:
				break;
		}
  }

	async info(obj) {
		if (!this.pool) {
      throw new Error('Your connection was not established, please connect to the database!');
    }
		
		const connection = await this.pool.getConnection();
    try {
      await connection.execute(
        'INSERT INTO logsInfo (level_id, level_name, app_name, service_name, message) VALUES (?, ?, ?, ?, ?)',
        [0, obj.level, obj.app_name, obj.service_name, obj.message]
      );
    } catch (error) {
      console.error('Error executing query:', error);
    } finally {
      connection.release();
    }
	}

	async warning(obj) {
		if (!this.pool) {
      throw new Error('Your connection was not established, please connect to the database!');
    }
		
		const connection = await this.pool.getConnection();
    try {
      await connection.execute(
        'INSERT INTO logsWarn (level_id, level_name, app_name, service_name, message) VALUES (?, ?, ?, ?, ?)',
        [1, obj.level, obj.app_name, obj.service_name, obj.message]
      );
    } catch (error) {
      console.error('Error executing query:', error);
    } finally {
      connection.release();
    }
	}

	async error(obj) {
		if (!this.pool) {
      throw new Error('Your connection was not established, please connect to the database!');
    }
		
		const connection = await this.pool.getConnection();
    try {
      await connection.execute(
        'INSERT INTO logsError (level_id, level_name, app_name, service_name, message) VALUES (?, ?, ?, ?, ?)',
        [2, obj.level, obj.app_name, obj.service_name, obj.message]
      );
    } catch (error) {
      console.error('Error executing query:', error);
    } finally {
      connection.release();
    }
	}

	async system(obj) {
		if (!this.pool) {
      throw new Error('Your connection was not established, please connect to the database!');
    }
		
		const connection = await this.pool.getConnection();
    try {
      await connection.execute(
        'INSERT INTO logsSystem (level_id, level_name, app_name, service_name, message) VALUES (?, ?, ?, ?, ?)',
        [3, obj.level, obj.app_name, obj.service_name, obj.message]
      );
    } catch (error) {
      console.error('Error executing query:', error);
    } finally {
      connection.release();
    }
	}
}

module.exports = Logger