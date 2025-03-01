-- in geval van data verlies

INSERT INTO
    users (
    id,
    username,
    email,
    password_hash,
    created_at,
    last_login
)
VALUES
    (
        '550e8400-e29b-41d4-a716-446655440000',
        'john_doe',
        'john@example.com',
        'hashedpassword1',
        '2025-01-01T08:00:00Z',
        '2025-02-22T09:30:00Z'
    );

INSERT INTO
    workouts (
    id,
    user_id,
    name,
    created_at,
    duration_minutes,
    intensity
)
VALUES
    (
        1,
        '550e8400-e29b-41d4-a716-446655440000',
        'Monday',
        '2025-02-22T10:00:00Z',
        60,
        'High'
    ),
    (
        2,
        '550e8400-e29b-41d4-a716-446655440000',
        'Tuesday',
        '2025-02-23T10:00:00Z',
        55,
        'Medium'
    ),
    (
        3,
        '550e8400-e29b-41d4-a716-446655440000',
        'Wednesday',
        '2025-02-24T10:00:00Z',
        70,
        'High'
    ),
    (
        4,
        '550e8400-e29b-41d4-a716-446655440000',
        'Thursday',
        '2025-02-25T10:00:00Z',
        50,
        'Medium'
    ),
    (
        5,
        '550e8400-e29b-41d4-a716-446655440000',
        'Friday',
        '2025-02-26T10:00:00Z',
        65,
        'High'
    ),
    (
        6,
        '550e8400-e29b-41d4-a716-446655440000',
        'Saturday',
        '2025-02-27T11:00:00Z',
        40,
        'Low'
    ),
    (
        7,
        '550e8400-e29b-41d4-a716-446655440000',
        'Sunday',
        '2025-02-28T11:00:00Z',
        0,
        'None'
    );

INSERT INTO
    exercises (id, name, category, equipment)
VALUES
    (1, 'Bench Press', 'Chest', 'Barbell'),
    (2, 'Squat', 'Legs', 'Barbell'),
    (3, 'Deadlift', 'Back', 'Barbell'),
    (4, 'Pull-up', 'Back', 'Bodyweight'),
    (5, 'Overhead Press', 'Shoulders', 'Barbell'),
    (6, 'Bicep Curl', 'Arms', 'Dumbbell'),
    (7, 'Tricep Dips', 'Arms', 'Bodyweight'),
    (8, 'Leg Press', 'Legs', 'Machine'),
    (9, 'Running', 'Cardio', 'Treadmill'),
    (10, 'Jump Rope', 'Cardio', 'Rope');

INSERT INTO
    workout_exercises (id, workout_id, exercise_id, weight, sets, reps)
VALUES
    (1, 1, 1, 120, 3, 10),
    (2, 1, 7, NULL, 4, 12),
    (3, 1, 6, 15, 3, 12),
    (4, 2, 3, 140, 4, 8),
    (5, 2, 4, NULL, 3, 10),
    (6, 2, 6, 12, 3, 15),
    (7, 3, 2, 160, 4, 10),
    (8, 3, 8, 200, 3, 12),
    (9, 4, 5, 60, 3, 8),
    (10, 4, 6, 15, 4, 12),
    (11, 5, 1, 100, 3, 12),
    (12, 5, 3, 130, 3, 10),
    (13, 5, 2, 150, 3, 10),
    (14, 6, 9, NULL, 1, 30),
    (15, 6, 10, NULL, 3, 50);

INSERT INTO
    personal_records (
    id,
    user_id,
    exercise_id,
    max_weight,
    max_reps,
    achieved_at
)
VALUES
    (
        1,
        '550e8400-e29b-41d4-a716-446655440000',
        1,
        130,
        8,
        '2025-02-20T09:00:00Z'
    ),
    (
        2,
        '550e8400-e29b-41d4-a716-446655440000',
        3,
        160,
        6,
        '2025-02-19T08:30:00Z'
    ),
    (
        3,
        '550e8400-e29b-41d4-a716-446655440000',
        2,
        180,
        5,
        '2025-02-18T10:15:00Z'
    );

INSERT INTO
    progress (id, user_id, date, weight_kg, body_fat_percentage)
VALUES
    (
        1,
        '550e8400-e29b-41d4-a716-446655440000',
        '2025-02-01',
        80,
        15.5
    ),
    (
        2,
        '550e8400-e29b-41d4-a716-446655440000',
        '2025-02-08',
        81,
        15.2
    ),
    (
        3,
        '550e8400-e29b-41d4-a716-446655440000',
        '2025-02-15',
        81.5,
        14.9
    ),
    (
        4,
        '550e8400-e29b-41d4-a716-446655440000',
        '2025-02-22',
        82,
        14.5
    );