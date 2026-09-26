<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Sale extends Model
{
    protected $fillable = ['course_id', 'amount', 'commission', 'note', 'sold_at'];

    protected function casts(): array
    {
        return [
            'amount' => 'float',
            'commission' => 'float',
            'sold_at' => 'date:Y-m-d',
        ];
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }
}
