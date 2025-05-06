<?php
$errors = [];
$myemail = 'amontearx66@gmail.com';
$response = ['success' => false];

// Проверка наличия всех обязательных полей
if (empty($_POST['name']) || empty($_POST['email']) || empty($_POST['subject']) || empty($_POST['message'])) {
    $errors[] = "Все поля формы обязательны для заполнения";
}

// Безопасная обработка входных данных
$name = filter_var($_POST['name'] ?? '', FILTER_SANITIZE_STRING);
$email = filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL);
$subject = filter_var($_POST['subject'] ?? '', FILTER_SANITIZE_STRING);
$message = filter_var($_POST['message'] ?? '', FILTER_SANITIZE_STRING);

// Проверка email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = "Неверный формат электронной почты";
}

if (empty($errors)) {
    $to = $myemail;
    $email_subject = "Контактная форма: " . htmlspecialchars($subject);
    $email_body = "Имя: " . htmlspecialchars($name) . "\n" .
                 "Email: " . htmlspecialchars($email) . "\n" .
                 "Тема: " . htmlspecialchars($subject) . "\n" .
                 "Сообщение: \n" . htmlspecialchars($message);
    
    $headers = "From: " . htmlspecialchars($email) . "\r\n" .
               "Reply-To: " . htmlspecialchars($email) . "\r\n" .
               "X-Mailer: PHP/" . phpversion();
    
    // Попытка отправки письма
    if (mail($to, $email_subject, $email_body, $headers)) {
        $response['success'] = true;
        $response['message'] = "Сообщение успешно отправлено";
    } else {
        $errors[] = "Не удалось отправить сообщение. Пожалуйста, попробуйте позже.";
    }
} 

if (!empty($errors)) {
    $response['errors'] = $errors;
}

// Отправляем JSON-ответ для AJAX-запросов
if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
} else {
    // Для обычных запросов делаем редирект или показываем сообщение
    if ($response['success']) {
        // Редирект на страницу "спасибо"
        header('Location: thank-you.html');
    } else {
        // Вывод ошибок
        echo "<ul>";
        foreach ($errors as $error) {
            echo "<li>$error</li>";
        }
        echo "</ul>";
    }
}
?>