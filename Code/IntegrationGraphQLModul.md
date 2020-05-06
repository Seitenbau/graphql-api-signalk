**Wie kann GraphQL in das Backend integriert werden**

Die Integration ist sehr einfach. Das aktuelle Server kann problemlos um einen GraphQL Endpunkt erweitert werden.
Dieser Enpunkt kann zur logischen Abtrennung von der REST-API in ein eigenes File verlagert werden. Damit würde er sich auch an der allgemeinen Struktur der anderen, bereits vorhandenen Schnittstellen(Websocket, native tcp, etc.) anpassen.
