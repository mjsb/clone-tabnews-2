const { exec } = require("node:child_process");

function checkPostgres() {
  exec("docker exec postgres-dev pg_isready --host localhost", handleReturn);

  function handleReturn(error, stout) {
    if (stout.search("accepting connections") === -1) {
      process.stdout.write(".");
      checkPostgres();
      return;
    }

    console.log("\n\n🟢 Postgres está pronto e aceitando conexões!\n\n");
  }
}

process.stdout.write("\n\n🔴 Aguardando Postgres aceitar conexões ");
checkPostgres();
