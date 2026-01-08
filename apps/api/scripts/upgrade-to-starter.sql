UPDATE subscriptions 
SET plan = 'STARTER', status = 'ACTIVE'
FROM users 
WHERE subscriptions."userId" = users.id 
  AND users.email = 'williner.martin@gmail.com';

SELECT u.email, s.plan, s.status 
FROM users u 
JOIN subscriptions s ON s."userId" = u.id 
WHERE u.email = 'williner.martin@gmail.com';
