import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();
  const databaseVersionResult = await database.query("SHOW server_version;");
  const databaseMaxConnectionsResult = await database.query(
    "SHOW max_connections;",
  );
  const databaseName = process.env.POSTGRES_DB;
  const databaseOpenedConnectionsResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname =  $1;",
    values: [databaseName],
  });

  console.log(
    "Database Version:",
    databaseVersionResult.rows[0].server_version,
  ); // Log the database info for debugging
  console.log(
    "Max Connections:",
    databaseMaxConnectionsResult.rows[0].max_connections,
  );
  console.log(
    "Opened Connections:",
    databaseOpenedConnectionsResult.rows[0].count,
  ); // Log the number of opened connections for debugging

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: databaseVersionResult.rows[0].server_version,
        max_connections: parseInt(
          databaseMaxConnectionsResult.rows[0].max_connections,
        ),
        open_connections: databaseOpenedConnectionsResult.rows[0].count,
      },
    },
  });
}

export default status;
