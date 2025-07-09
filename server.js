const fs = require('fs').promises;
const { randomInt } = require('crypto');
const http = require('http')

//array que vai receber as tasks
const tasks = [
];

async function CreateListOfTasks() {
    try {
        const datatasks = { tasks };
        await fs.writeFile('datatasks.json', JSON.stringify(datatasks, null, 2), 'utf8')
    } catch (error) {
        console.error('Erro ao salvar as tarefas:', error);
    }
};



//iniciando servidor get
const server = http.createServer((req, res) => {
    try {
        //endpoint do post /tarefas

        if (req.method === 'GET' && req.url === '/tarefas') {
            res.writeHead(200, { 'Content-type': 'application/json' })
            res.end(JSON.stringify(tasks))
        }
    } catch (error) {
        res.writeHead(500, { 'content-type': 'application/json' });
        res.end(JSON.stringify({
            message: 'erro ao retornar tasks',
            error: error.message
        }))
    }
});

const appserver = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/tarefas') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const newTask = JSON.parse(body) //convertendo string para objeto

                //gerando id 
                const newId = randomInt(1000, 9999);
                const task = {
                    id: newId,
                    title: newTask.title
                };

                //chamando a função de criar o arquivo json
                CreateListOfTasks();

                //enviando as taks para o array com o push
                tasks.push(task)
                //caso seja criado a task irá enviar com a mensagem
                res.writeHead(201, { 'content-type': 'application/json' })
                res.end(JSON.stringify({ message: 'Task adicionada', tarefas: tasks }));
            } catch (error) {
                //caso não seja criada retorna um erro
                res.writeHead(400, { 'content-type': 'application/json' })

                res.end(JSON.stringify({ message: 'Json invalido', tarefas: tasks }));

            }
        })
    }
})


server.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});

appserver.listen(3001, () => {
    console.log('servidor ligado');
})
