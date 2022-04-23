psql -f install.sql -U postgres
PGPASSWORD=marcus psql -d bos -f structure.sql -U marcus
