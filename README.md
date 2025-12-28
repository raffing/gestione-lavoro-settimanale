# Gestione Lavoro Settimanale - Pamar Cleaning

Una moderna web app React per la gestione del lavoro settimanale di un'impresa di pulizie.

## Funzionalità

### Per Amministratori
- **Gestione Edifici**: Aggiungi, modifica ed elimina condomini e uffici
- **Gestione Operai**: Gestisci il team di lavoro
- **Assegnazioni**: Assegna operai agli edifici per ogni giorno della settimana
- **Tempi Stimati**: Configura i tempi di completamento in base al numero di operai

### Per Operai
- **Dashboard Giornaliera**: Visualizza i lavori assegnati per ogni giorno
- **Completamento Attività**: Segna i lavori come completati con un click
- **Progresso**: Monitora il progresso giornaliero

## Caratteristiche Tecniche

- **React 19** con TypeScript
- **Vite** per build veloce
- **Tailwind CSS** per lo styling responsive
- **React Router** per la navigazione
- **LocalStorage** per la persistenza dei dati

## Installazione

```bash
npm install
npm run dev
```

## Credenziali Demo

- **Admin**: username `admin`, password `admin`
- **Operaio**: username `mario`, password `mario123`
- **Operaio**: username `luigi`, password `luigi123`

## Struttura Dati

### Edifici (Buildings)
- Nome e indirizzo
- Tipo (condominio/ufficio)
- Giorni programmati della settimana
- Tempi stimati per numero di operai

### Assegnazioni (Assignments)
- Edificio da pulire
- Giorno della settimana
- Operai assegnati (singolo o multipli)

### Completamenti (Completions)
- Tracciamento dello stato di completamento per data
