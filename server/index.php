<?php

use App\Controller\Home;
use App\Database\Pool;
use Oktaax\Oktaax;
use Oktaax\Trait\HasWebsocket;
use Oktaax\Views\PhpView;
use Swoole\Server\Task;

$app =  new class extends Oktaax {
    use HasWebsocket;
};

Pool::create(5);

$app->setServer('task_worker_num', 2);
$app->setServer('task_enable_coroutine', true);
$app->setView(new PhpView(__DIR__."/../resources/view/"));

$app->on("Task", function ($server, Task $task) {});

$app->on("Finish", function ($s, $id) {

    echo "finish $id\n";
});
$app->on("WorkerStart", function () {
    Pool::fill();
});
$app->on("WorkerExit", function () {
    Pool::close();
});
$app->get("/", [Home::class, 'index']);

$app->get("/test", function () {
    return "1";
});


return $app;

