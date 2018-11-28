<?php

use Slim\Http\Request;
use Slim\Http\Response;
use Aws\S3\S3Client;

$client = new S3Client([
    'version' => '2006-03-01',
    'region' => $app->getContainer()->get('settings')['aws']['s3']['region']
]);

// Register the stream wrapper from an S3Client object
$client->registerStreamWrapper();

// Routes

$app->get('/', function (Request $request, Response $response, array $args) {
    // Render index view
    return $this->renderer->render($response, 'index.twig', $args);
});

$app->get('/data', function (Request $request, Response $response, array $args) {
    // Return current data object
    
    $file = 's3://' . $this->get('settings')['aws']['s3']['bucket'] . '/' . $this->get('settings')['aws']['s3']['object'];
    $json = json_decode(file_get_contents($file));
    
    $response = $response->withAddedHeader('Access-Control-Allow-Origin', '*')->withJson($json);
    
    return $response;
});

$app->put('/data', function (Request $request, Response $response, array $args) {
    // Update data object
    
    if (!$request->hasHeader('Accept') ||
        $request->getHeader('Accept')[0] != 'application/json') {
        return $response->withStatus(400, 'Payload should be delivered in JSON.');
    }
    
    $parsedBody = $request->getParsedBody();
    
    if (empty($parsedBody['answers']) || empty($parsedBody['visits'])) {
        return $response->withStatus(400, 'Payload was malformed.');
    }
    
    $file = 's3://' . $this->get('settings')['aws']['s3']['bucket'] . '/' . $this->get('settings')['aws']['s3']['object'];
    file_put_contents($file, json_encode($parsedBody));
    
    return $response->withStatus(200);
});